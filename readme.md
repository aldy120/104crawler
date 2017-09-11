# mycrawler
Download all company data from 104.com.tw

# Get started
1. Download all company data from 104, and store in companies.txt
```
node --max-old-space-size=4096 app.js
```

2. Put to mongodb
```
node helper/insertCompany.js
```

3. Change field to number (employee and capital)
```
node helper/changeFieldType.js
```

OK!