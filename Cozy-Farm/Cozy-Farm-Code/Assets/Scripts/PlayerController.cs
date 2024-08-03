using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 5f;
    private Animator animator;
    private Vector2 movement;

    void Start()
    {
        animator = GetComponent<Animator>();
    }

    void Update()
    {
        ProcessInputs();
        AnimateMovement();
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
        transform.Translate(movement * moveSpeed * Time.deltaTime);
    }

     void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Egg"))
        {
            gameManager.CollectEgg(other.gameObject); // Collect egg
        } else  if (other.CompareTag("Milk"))
        {
            gameManager.CollectMilk(other.gameObject); // Collect milk
        }
    }



}
