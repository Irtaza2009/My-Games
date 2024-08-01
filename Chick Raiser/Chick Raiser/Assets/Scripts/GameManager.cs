using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;

public class GameManager : MonoBehaviour
{
    public int coinCount = 0;
    public int eggCount = 0;

    public TextMeshProUGUI coinText;
    public TextMeshProUGUI eggText;

    public GameObject chickPrefab;

    void Update()
    {
        coinText.text = "Coins: " + coinCount;
        eggText.text = "Eggs: " + eggCount;
    }

    public void AddCoin()
    {
        coinCount++;
        UpdateCoinUI();
    }

    public void SpendCoins(int amount)
    {
        coinCount -= amount;
        UpdateCoinUI();
    }

    void UpdateCoinUI()
    {
        coinText.text = "Coins: " + coinCount;
    }

    public void CollectEgg(GameObject egg)
    {
        eggCount++;
        UpdateEggUI();
        Destroy(egg);
    }

    void UpdateEggUI()
    {
        eggText.text = "Eggs: " + eggCount;
    }

    public void SellEggs()
    {
        coinCount += eggCount;
        eggCount = 0;
        UpdateCoinUI();
        UpdateEggUI();
    }

    public void HatchEgg()
    {
        if (eggCount > 0)
        {
            eggCount--;
            UpdateEggUI();
            StartCoroutine(HatchEggCoroutine());
        }
    }

    IEnumerator HatchEggCoroutine()
    {
        yield return new WaitForSeconds(20f);
        Vector3 chickPosition = GetRandomPosition();
        Instantiate(chickPrefab, chickPosition, Quaternion.identity);
    }

    Vector3 GetRandomPosition()
    {
        return new Vector3(Random.Range(-5f, 5f), Random.Range(-5f, 5f), -1);
    }
}
