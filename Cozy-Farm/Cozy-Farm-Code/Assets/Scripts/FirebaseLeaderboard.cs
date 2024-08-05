using Firebase;
using Firebase.Database;
using Firebase.Extensions;
using UnityEngine;
using TMPro;
using System.Collections.Generic;

public class FirebaseLeaderboard : MonoBehaviour
{
    public TextMeshProUGUI leaderboardText;
    private DatabaseReference databaseReference;
    private string playerName;

    void Start()
    {
        playerName = PlayerPrefs.GetString("PlayerName", "Unknown");
        Debug.Log("Player Name at Start: " + playerName);

        

        FirebaseApp.CheckAndFixDependenciesAsync().ContinueWithOnMainThread(task =>
        {
            if (task.IsCompleted)
            {
                FirebaseApp app = FirebaseApp.DefaultInstance;
                databaseReference = FirebaseDatabase.DefaultInstance.RootReference;
                Debug.Log("Database Reference Initialized: " + (databaseReference != null));
                LoadScores();
            }
            else
            {
                Debug.LogError("Could not initialize Firebase dependencies.");
            }
        });
    }

    public void AddScore(int score)
    {
        if (databaseReference == null)
        {
            Debug.LogError("Database reference is not initialized.");
            return;
        }

        Debug.Log("Adding score for player: " + playerName + " Score: " + score);
        
        databaseReference.Child("leaderboard").Child(playerName).GetValueAsync().ContinueWithOnMainThread(task =>
        {
            if (task.IsCompleted)
            {
                DataSnapshot snapshot = task.Result;
                if (snapshot.Exists)
                {
                    int currentScore = int.Parse(snapshot.Child("score").Value.ToString());
                    if (score > currentScore)
                    {
                        // Update the score if the new score is higher
                        LeaderboardEntry entry = new LeaderboardEntry(playerName, score);
                        string json = JsonUtility.ToJson(entry);
                        databaseReference.Child("leaderboard").Child(playerName).SetRawJsonValueAsync(json).ContinueWithOnMainThread(task =>
                        {
                            LoadScores(); // Reload scores to update the leaderboard
                        });
                    }
                }
                else
                {
                    // Add new entry if no previous score exists
                    LeaderboardEntry entry = new LeaderboardEntry(playerName, score);
                    string json = JsonUtility.ToJson(entry);
                    databaseReference.Child("leaderboard").Child(playerName).SetRawJsonValueAsync(json).ContinueWithOnMainThread(task =>
                    {
                        LoadScores(); // Reload scores to update the leaderboard
                    });
                }
            }
        });
    }

    private void LoadScores()
    {
        if (databaseReference == null)
        {
            Debug.LogError("Database reference is not initialized.");
            return;
        }

        databaseReference.Child("leaderboard").OrderByChild("score").LimitToLast(10).GetValueAsync().ContinueWithOnMainThread(task =>
        {
            if (task.IsCompleted)
            {
                DataSnapshot snapshot = task.Result;
                List<LeaderboardEntry> leaderboardEntries = new List<LeaderboardEntry>();

                foreach (DataSnapshot child in snapshot.Children)
                {
                    string json = child.GetRawJsonValue();
                    LeaderboardEntry entry = JsonUtility.FromJson<LeaderboardEntry>(json);
                    leaderboardEntries.Add(entry);
                }

                leaderboardEntries.Sort((a, b) => b.score.CompareTo(a.score));
                UpdateLeaderboard(leaderboardEntries);
            }
        });
    }

    private void UpdateLeaderboard(List<LeaderboardEntry> entries)
    {
        leaderboardText.text = "Leaderboard\n";
        foreach (var entry in entries)
        {
            leaderboardText.text += entry.playerName + ": " + entry.score + "\n";
        }
    }
}

[System.Serializable]
public class LeaderboardEntry
{
    public string playerName;
    public int score;

    public LeaderboardEntry(string playerName, int score)
    {
        this.playerName = playerName;
        this.score = score;
    }
}
