import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function ExpenseDetail() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    API.get(`/expenses/${id}`).then(res => setExpense(res.data));
  }, [id]);

  if (!expense) return null;

  return (
    <div className="p-6">
      <h2 className="font-bold">{expense.title}</h2>
      <p>Amount: {expense.amount}</p>
      <p>Type: {expense.type}</p>
      <p>Category: {expense.category}</p>
      <p>Description: {expense.description}</p>
    </div>
  );
}
