using UnityEngine;

public class WorkerChicken : MonoBehaviour
{
    public float speed = 2f;
    private Vector2 direction;
    private float minX, maxX, minY, maxY;
    private GameManager gameManager;

    void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
        UpdateBoundaries();
        ChangeDirection();
        InvokeRepeating("ChangeDirection", 2f, 2f);
    }

    void Update()
    {
        Vector3 newPosition = transform.position + (Vector3)direction * speed * Time.deltaTime;
        newPosition.x = Mathf.Clamp(newPosition.x, minX, maxX);
        newPosition.y = Mathf.Clamp(newPosition.y, minY, maxY);
        transform.position = newPosition;
    }

    void ChangeDirection()
    {
        float angle = Random.Range(0, 360);
        direction = new Vector2(Mathf.Cos(angle), Mathf.Sin(angle)).normalized;
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Egg"))
        {
            gameManager.CollectEgg(other.gameObject); // Collect egg
        }
    }

    public void UpdateBoundaries()
    {
        minX = GameObject.Find("LeftBoundary").transform.position.x + 0.5f;
        maxX = GameObject.Find("RightBoundary").transform.position.x - 0.5f;
        minY = GameObject.Find("BottomBoundary").transform.position.y + 0.5f;
        maxY = GameObject.Find("TopBoundary").transform.position.y - 0.5f;
    }
}
