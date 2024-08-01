using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class StoreCard : MonoBehaviour
{
    public Image itemImage;

    public TextMeshProUGUI itemName;

    public TextMeshProUGUI itemPrice;
    private StoreItem storeItem;

    private Vector3 initialPosition;
    private Vector3 targetPosition;

    private void Start()
    {
        initialPosition = transform.position;
        targetPosition = initialPosition + new Vector3(0, 100, 0); // Adjust as needed for how much you want it to move up
    }

    public void SetStoreItem(StoreItem item)
    {
        storeItem = item;
        itemName.text = item.itemName;
        itemImage.sprite = item.itemImage;
        itemPrice.text = item.itemPrice.ToString();
    }

    public void OnMouseEnter()
    {
        transform.position = targetPosition;
    }

    public void OnMouseExit()
    {
        transform.position = initialPosition;
    }

  

}
