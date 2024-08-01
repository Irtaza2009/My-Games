using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class GameManager : MonoBehaviour
{
    public int coinCount = 0;
    public TextMeshProUGUI coinText;
    public GameObject chickPrefab;

    void Update()
    {
        coinText.text = "Coins: " + coinCount;
    }

    public void AddCoin()
    {
        coinCount++;
    }

    public void BuyEgg()
    {
        if (coinCount >= 10)
        {
            coinCount -= 10;
            Instantiate(chickPrefab, GetRandomPosition(), Quaternion.identity);
        }
    }

    Vector3 GetRandomPosition()
    {
        return new Vector3(Random.Range(-5f, 5f), Random.Range(-5f, 5f), -1);
    }
}
