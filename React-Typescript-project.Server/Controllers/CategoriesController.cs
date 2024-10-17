using Microsoft.AspNetCore.Mvc;
using React_Typescript_project.Server.Modals;
using React_Typescript_project.Server.Services;

namespace React_Typescript_project.Server.Controllers
{

    [ApiController]
    [Route("CategoriesController")]
    public class CategoriesController : Controller
    {
        private readonly CategoriesServices _categoriesServices;

        public CategoriesController(CategoriesServices services) =>
            _categoriesServices = services;

        [HttpGet("{UserId:length(24)}GetCategoriesByUserId")]
        public async Task<ActionResult<List<Categories>>> GetCategoriesByUserId(string UserId)
        {
            var categories = await _categoriesServices.GetCategoriesByUserId(UserId);
            return Ok(categories);
        }
        [HttpPost("{UserId:length(24)}CreateCategoriesAndUpdate")]
        public async Task<IActionResult> SaveCategories(string UserId, [FromBody] Categories category)
        {
            try
            {
                category.UserId = UserId;
                var savedCategory = await _categoriesServices.SaveCategoriesByUserId(category);
                return Ok(savedCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Somthing wait wrong:{ex.Message}");
            }
        }

        [HttpPost("{id:length(24)}DeleteCategory")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            try
            {
                var result = await _categoriesServices.DeleteCategory(id);
                if(result.DeletedCount  > 0)
                {
                    return Ok(new { message = "Category deleted successfully" });
                }
                else
                {
                    return NotFound(new { message = "Category not found" });
                }
            }catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error:{ex.Message}");

            }
        }

    }
}
