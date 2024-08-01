using UnityEngine;

public class ChickMovement : MonoBehaviour
{
    public float speed = 2f;
    private Vector2 direction;
     public GameObject coinPrefab;
public float poopInterval = 3f;

    void Start()
    {
        ChangeDirection();
        InvokeRepeating("ChangeDirection", 2f, 2f);
         InvokeRepeating("PoopCoin", poopInterval, poopInterval);
    }

    void Update()
    {
        transform.Translate(direction * speed * Time.deltaTime);
    }

    void ChangeDirection()
    {
        float angle = Random.Range(0, 360);
        direction = new Vector2(Mathf.Cos(angle), Mathf.Sin(angle)).normalized;
    }

   



    void PoopCoin()
    {
        Instantiate(coinPrefab, transform.position, Quaternion.identity);
    }

    }
