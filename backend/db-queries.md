## Find last 5 expenses
### With Find Query
```javascript
db.expenses.find({
  userId: ObjectId("6874906b8b1f13bb02a1dabe"),
  date: {
    $lt: new Date("2025-07-14")
  }
}).sort({date: -1}).limit(5)
```
### With aggregation pipeline (includes categoryTitle)
```javascript
db.expenses.aggregate([
  {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category"
    }
  },
  {
    $unwind: "$category"
  },
  {
    $project: {
      _id: 1,
      description: 1,
      amount: 1,
      date: 1,
      categoryId: 1,
      userId: 1,
      categoryTitle: "$category.title"
    }
  },
  {
    $sort: {date: -1}
  },
  {
    $limit: 5
  }
])
```

## Find expenses category-wise
`Note: Remove categoryId if no category is selected`
```javascript
db.expenses.find({
  userId: ObjectId("6874906b8b1f13bb02a1dabe"),
  date: {
    $gte: new Date("2025-04-01"),
    $lte: new Date("2025-07-14")
  },
  categoryId: ObjectId("6874922e8b1f13bb02a1dacb")
})
```

## Find expenses