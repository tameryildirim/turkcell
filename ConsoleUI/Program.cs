using System.Reflection;

namespace ConsoleUI
{
    class Program
    {
        static void Main(string[] args)
        {
            IPlanService planManager = new PlanManager(new EfPlanDal());
            List<Plan> plans = planManager.GetPlans();

            foreach (Plan plan in plans)
            {
                Console.WriteLine(plan.Name.PadRight(30) + " :" + plan.Price);
            }

            Console.WriteLine(new string('-', 50));
            Console.ReadLine();
        }
    }
    interface IEntity
    {

    }
    class BaseEntity : IEntity
    {
        public int Id { get; set; }
        public string CreatorUserId { get; set; }
        public int CreateDateTime { get; set; }
        public string UpdaterUserUd { get; set; }
        public int UpdateDateTime { get; set; }
        public int Status { get; set; }
    }
    class Plan : BaseEntity
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal DiscountConstant { get; set; }
        public decimal DiscountPercent { get; set; }
        public string DiscountType { get; set; }
    }
    interface IPlanService
    {
        List<Plan> GetPlans();
    }
    class PlanManager : IPlanService
    {
        IPlanDal _planDal;
        IDiscountService _discountService;
        public PlanManager(IPlanDal planDal)
        {
            _planDal = planDal;
        }
        public List<Plan> GetPlans()
        {
            List<Plan> plans = _planDal.GetPlans();
            foreach(Plan plan in plans)
            {
                _discountService = (IDiscountService)ReflectClassName.CreateInstanceFromString(plan.DiscountType);
                _discountService.UpdatePrice(plan);
            }

            return plans;
        }
    }
    interface IPlanDal
    {
        List<Plan> GetPlans();
    }
    class EfPlanDal : IPlanDal
    {
        public List<Plan> GetPlans()
        {
            return new List<Plan>
            {
                new Plan{Id=1,Name="Aynen Favorim 10GB", Price=275.00m, DiscountConstant=75.0m,DiscountPercent=.22m,DiscountType="UpdatePriceByConstant"},
                new Plan{Id=1,Name="Star 15GB", Price=400.00m, DiscountConstant=90.0m,DiscountPercent=.15m,DiscountType="UpdatePriceByPercent"},
                new Plan{Id=1,Name="Turkcell Mutlu Çocuk 10GB", Price=200.00m, DiscountConstant=35.0m,DiscountPercent=.22m,DiscountType="NoDiscount"},
                new Plan{Id=1,Name="Bolca 24GB", Price=450.00m, DiscountConstant=85.0m,DiscountPercent=.10m,DiscountType="UpdatePriceByPercent"},
                new Plan{Id=1,Name="Prestij 20GB", Price=350.00m, DiscountConstant=95.0m,DiscountPercent=.30m,DiscountType="UpdatePriceByConstant"},
                new Plan{Id=1,Name="KKTC 20GB", Price=1210.53m, DiscountConstant=250.0m,DiscountPercent=.25m,DiscountType="UpdatePriceByConstant"}
            };
        }
    }
    interface IDiscountService
    {
        Plan UpdatePrice(Plan plan);
    }
    class NoDiscount: IDiscountService
    {
        public Plan UpdatePrice(Plan plan)
        {
            return plan;
        }
    }
    class UpdatePriceByConstant : IDiscountService
    {
        public Plan UpdatePrice(Plan plan)
        {
            plan.Price -= plan.DiscountConstant;
            return plan;
        }
    }
    class UpdatePriceByPercent : IDiscountService
    {
        public Plan UpdatePrice(Plan plan)
        {
            plan.Price -= plan.Price*plan.DiscountPercent;
            return plan;
        }
    }
    class ReflectClassName
    {
        public static object? CreateInstanceFromString(string className)
        {
            Assembly assembly = Assembly.GetExecutingAssembly();
            return Activator.CreateInstance(assembly.GetType(assembly.GetTypes().FirstOrDefault(t => t.Name == className).FullName));
        }
    }
}
