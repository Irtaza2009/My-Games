using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 1f;
    private Animator animator;
    private Vector2 movement;

    private float minX, maxX, minY, maxY;
    private GameManager gameManager;

    void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
        animator = GetComponent<Animator>();

        UpdateBoundaries();
    }

    void Update()
    {
        ProcessInputs();
        AnimateMovement();

        if (Input.GetKeyDown(KeyCode.Return))
        {
            CheckStandingSpot();
        }
    }

    void FixedUpdate()
    {
        Move();
    }

    void ProcessInputs()
    {
        movement.x = Input.GetAxis("Horizontal");
        movement.y = Input.GetAxis("Vertical");
    }

    void AnimateMovement()
    {
        if (movement != Vector2.zero)
        {
            animator.SetFloat("Horizontal", movement.x);
            animator.SetFloat("Vertical", movement.y);
            animator.SetBool("isMoving", true);

            if (movement.x > 0)
            {
                animator.Play("WorkerRight");
            }
            else if (movement.x < 0)
            {
                animator.Play("WorkerLeft");
            }
            else if (movement.y > 0)
            {
                animator.Play("WorkerUp");
            }
            else if (movement.y < 0)
            {
                animator.Play("WorkerDown");
            }
        }
        else
        {
            animator.SetBool("isMoving", false);
            animator.Play("WorkerIdle");
        }
    }

    void Move()
    {
        Vector3 newPosition = transform.position + (Vector3)movement * moveSpeed * Time.deltaTime;

        // Clamp the new position within the boundaries
        newPosition.x = Mathf.Clamp(newPosition.x, minX, maxX);
        newPosition.y = Mathf.Clamp(newPosition.y, minY, maxY);

        transform.position = newPosition;
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Egg"))
        {
            gameManager.CollectEgg(other.gameObject); // Collect egg
        }
        else if (other.CompareTag("Milk"))
        {
            gameManager.CollectMilk(other.gameObject); // Collect milk
        }
    }

    public void UpdateBoundaries()
    {
        minX = GameObject.Find("LeftBoundary").transform.position.x + 0.5f;
        maxX = GameObject.Find("RightBoundary").transform.position.x - 0.5f;
        minY = GameObject.Find("BottomBoundary").transform.position.y + 0.5f;
        maxY = GameObject.Find("TopBoundary").transform.position.y - 0.5f;
    }


     void CheckStandingSpot()
    {
        // Assuming you have colliders on the spots with appropriate tags
        Collider2D[] hitColliders = Physics2D.OverlapCircleAll(transform.position, 0.1f);

        foreach (var hitCollider in hitColliders)
        {
            if (hitCollider.CompareTag("ChickenSpot"))
            {
                SceneManager.LoadScene("ChickenFarm");
            }
            else if (hitCollider.CompareTag("CowSpot"))
            {
                SceneManager.LoadScene("CowFarm");
            }
        }
    }


    
}
