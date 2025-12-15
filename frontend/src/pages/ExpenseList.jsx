import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`/expenses?keyword=${search}`).then(res => {
      setExpenses(res.data.expenses);
    });
  }, [search]);

  return (
    <>
      <h2>Expenses</h2>
      <input placeholder="Search expense" onChange={e=>setSearch(e.target.value)} />
      <ul>
        {expenses.map(e => (
          <li key={e._id}>{e.title} - ₹{e.amount}</li>
        ))}
      </ul>
    </>
  );
}
