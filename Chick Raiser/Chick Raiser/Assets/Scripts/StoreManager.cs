using UnityEngine;

public class StoreManager : MonoBehaviour
{
    public StoreItem[] storeItems;
    public GameObject storeCardPrefab;
    public Transform storeCardParent;

    void Start()
    {
        foreach (StoreItem item in storeItems)
        {
            GameObject card = Instantiate(storeCardPrefab, storeCardParent);
            StoreCard storeCard = card.GetComponent<StoreCard>();
            storeCard.SetStoreItem(item);
        }
    }
}
