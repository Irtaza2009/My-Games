using Firebase;
using Firebase.Database;
using Firebase.Extensions;
using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using TMPro;

public class FirebaseLeaderboard : MonoBehaviour
{
    public TextMeshProUGUI leaderboardText;
    private DatabaseReference databaseReference;

    void Start()
    {
        FirebaseApp.CheckAndFixDependenciesAsync().ContinueWithOnMainThread(task =>
        {
            FirebaseApp app = FirebaseApp.DefaultInstance;
            databaseReference = FirebaseDatabase.DefaultInstance.RootReference;
            LoadScores();
        });
    }

    public void AddScore(string playerName, int score)
    {
        string key = databaseReference.Child("leaderboard").Push().Key;
        LeaderboardEntry entry = new LeaderboardEntry(playerName, score);
        string json = JsonUtility.ToJson(entry);
        databaseReference.Child("leaderboard").Child(key).SetRawJsonValueAsync(json);
    }

    private void LoadScores()
    {
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
        for (int i = 0; i < entries.Count; i++)
        {
            leaderboardText.text += (i + 1) + ". " + entries[i].playerName + " - " + entries[i].score + "\n";
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
