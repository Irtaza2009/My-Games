using Firebase;
using Firebase.Database;
using Firebase.Extensions;
using UnityEngine;
using System.Collections.Generic;

public class DataSaver : MonoBehaviour
{

    




    private DatabaseReference databaseReference;
    private string playerName;

    void Start()
    {
        playerName = PlayerPrefs.GetString("PlayerName", "Unknown");

        FirebaseApp.CheckAndFixDependenciesAsync().ContinueWithOnMainThread(task =>
        {
            if (task.IsCompleted)
            {
                FirebaseApp app = FirebaseApp.DefaultInstance;
                databaseReference = FirebaseDatabase.DefaultInstance.RootReference;
                Debug.Log("Database Reference Initialized: " + (databaseReference != null));
            }
            else
            {
                Debug.LogError("Could not initialize Firebase dependencies.");
            }
        });
    }

    public void SavePlayerData(int eggCount, int milkCount, int fruitCount, int coinCount, int workerCost, int cowCost, int hatchCost)
    {
        if (databaseReference == null)
        {
            Debug.LogError("Database reference is not initialized.");
            return;
        }

        PlayerData playerData = new PlayerData(playerName, eggCount, milkCount, fruitCount, coinCount, workerCost, cowCost, hatchCost);
        string json = JsonUtility.ToJson(playerData);

        databaseReference.Child("playerData").Child(playerName).SetRawJsonValueAsync(json).ContinueWithOnMainThread(task =>
        {
            if (task.IsCompleted)
            {
                Debug.Log("Player data saved successfully.");
            }
            else
            {
                Debug.LogError("Failed to save player data.");
            }
        });
    }

    public void LoadPlayerData(System.Action<PlayerData> onDataLoaded)
    {
        if (databaseReference == null)
        {
            Debug.LogError("Database reference is not initialized.");
            return;
        }

        databaseReference.Child("playerData").Child(playerName).GetValueAsync().ContinueWithOnMainThread(task =>
        {
            if (task.IsCompleted)
            {
                DataSnapshot snapshot = task.Result;
                if (snapshot.Exists)
                {
                    string json = snapshot.GetRawJsonValue();
                    PlayerData playerData = JsonUtility.FromJson<PlayerData>(json);
                    Debug.Log("Player data loaded successfully.");
                    onDataLoaded?.Invoke(playerData);
                }
                else
                {
                    Debug.LogWarning("Player data not found.");
                }
            }
            else
            {
                Debug.LogError("Failed to load player data.");
            }
        });
    }
}

[System.Serializable]
public class PlayerData
{
    public string playerName;
    public int eggCount;
    public int milkCount;
    public int fruitCount;
    public int coinCount;

    public int workerCost;
    public int cowCost;
    public int hatchCost;

    public PlayerData(string playerName, int eggCount, int milkCount, int fruitCount, int coinCount, int workerCost, int hatchCost, int cowCost)
    {
        this.playerName = playerName;
        this.eggCount = eggCount;
        this.milkCount = milkCount;
        this.fruitCount = fruitCount;
        this.coinCount = coinCount;
        this.workerCost = workerCost;
        this.hatchCost = hatchCost;
        this.cowCost = cowCost;
    }
    
}
