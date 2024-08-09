using System.Collections;
using UnityEngine;

public class Plot : MonoBehaviour
{
    private Animator animator;
    private bool isPlanted = false;
    private bool isHarvestable = false;

    private string fruitType = "Wheat";

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

        if (fruitType == "Wheat")
        {
            animator.Play("WheatGrowth");
        }
        else
        {
            animator.Play("FruitGrowth");
        }
       
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

    public void FruitSwitch()
    {
        if fruitType == "Wheat"
        {
            fruitType = "Fruit";
        }
        else
        {
            fruitType = "Wheat";
        }
    }
}
