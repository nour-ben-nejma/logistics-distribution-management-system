import os
import re

files = [
    r"c:\Users\benne\OneDrive\Desktop\LogistiCo\client\src\components\CompanyDashboard\fourniss.vue",
    r"c:\Users\benne\OneDrive\Desktop\LogistiCo\client\src\components\CompanyDashboard\vehicles.vue",
    r"c:\Users\benne\OneDrive\Desktop\LogistiCo\client\src\components\CompanyDashboard\AddPointList.vue",
    r"c:\Users\benne\OneDrive\Desktop\LogistiCo\client\src\components\CompanyDashboard\distributionPlan.vue",
    r"c:\Users\benne\OneDrive\Desktop\LogistiCo\client\src\components\AdminDashboard\warehouse.vue",
    r"c:\Users\benne\OneDrive\Desktop\LogistiCo\client\src\components\AdminDashboard\company.vue",
    r"c:\Users\benne\OneDrive\Desktop\LogistiCo\client\src\components\AdminDashboard\Rental.vue",
    r"c:\Users\benne\OneDrive\Desktop\LogistiCo\client\src\components\AdminDashboard\Navbar.vue"
]

for file in files:
    if os.path.exists(file):
        content = open(file, 'r', encoding='utf-8').read()
        match = re.search(r'(<div[^>]*modal-overlay[^>]*>.*?</template>)', content, re.DOTALL)
        if match:
            print("="*80)
            print("FILE:", os.path.basename(file))
            print("="*80)
            modal_content = match.group(1)[:1500]
            print(modal_content)
