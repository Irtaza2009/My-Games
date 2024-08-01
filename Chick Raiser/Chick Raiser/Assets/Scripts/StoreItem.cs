using UnityEngine;

[CreateAssetMenu(fileName = "New Store Item", menuName = "Store/Store Item")]
public class StoreItem : ScriptableObject
{
    public string itemName;
    public Sprite itemImage;
    public int itemPrice;
    public GameObject itemPrefab;
}
