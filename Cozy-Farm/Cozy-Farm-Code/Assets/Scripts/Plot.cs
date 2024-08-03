using System.Collections;
using UnityEngine;

public class Plot : MonoBehaviour
{
    private Animator animator;
    private bool isPlanted = false;
    private bool isHarvestable = false;

    void Start()
    {
        animator = GetComponent<Animator>();
    }

    public void PlantSeed()
    {
        if (!isPlanted)
        {
            StartCoroutine(GrowPlant());
        }
    }

    private IEnumerator GrowPlant()
    {
        isPlanted = true;
        animator.Play("WheatGrowth"); // Assuming "PlantGrowth" is the name of your animation
        yield return new WaitForSeconds(8f); // Wait for the animation to complete
        isHarvestable = true;
    }

    public bool Harvest()
    {
        if (isHarvestable)
        {
            animator.Play("IdlePlot"); // Optional: play a harvest animation or reset to idle
            isPlanted = false;
            isHarvestable = false;
            return true;
        }
        return false;
    }
}
