import { useState, useEffect } from "react";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import { data } from "../../data";
import axios from "axios";

const headers = {
  "content-type": "application/json",
};

const requestBody = {
  query: `query MyQuery {
    accountsConnection(orderBy: id_ASC, first: 20) {
      edges {
        node {
          id
          latestOrder
          orderType
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      totalCount
    }
  }`,
};

const graphQLOptions = {
  method: "POST",
  url: process.env.NEXT_PUBLIC_SQUID_URL || "http://localhost:4350/graphql",
  headers,
  data: requestBody,
};

type DataInterface = {
  id: string;
  latestOrder: string;
  orderType: string;
};

function Customers() {
  const [customers, setCustomers] = useState<DataInterface[] | null>(null);
  useEffect(() => {
    try {
      axios(graphQLOptions).then((response) => {
        setCustomers([
          ...response.data.data.accountsConnection.edges.map((obj: any) => {
            return {
              id: obj.node.id,
              latestOrder: new Date(
                Number(obj.node.latestOrder)
              ).toLocaleDateString(),
              orderType: obj.node.orderType
            };
          }),
        ]);
      });
    } catch (err) {
      console.log("ERROR DURING AXIOS REQUEST", err);
    }
  }, []);

  if (!customers)
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-between p-4">
          <h2>Customers</h2>
          <h2>Welocome back, Massimo</h2>
        </div>
        <div className="p-4">
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
              <span>Name</span>
              <span className="sm:text-left text-right">Email</span>
              <span className="hidden md:grid">Last Order</span>
              <span className="hidden sm:grid">Method</span>
            </div>
            <div>
              <h1>No data 🤷‍♂️!</h1>
              <h2>Try to refresh the page in a short while</h2>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-between p-4">
        <h2>Customers</h2>
        <h2>Welocome back, Massimo</h2>
      </div>
      <div className="p-4">
        <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
          <div className="my-3 p-2 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center justify-between cursor-pointer">
            <span>Address</span>
            <span className="sm:text-left text-right">Last Order Date</span>
            <span className="hidden md:grid">Order Type</span>
          </div>
          <ul>
            {customers.map((customer, id) => (
              <li
                key={id}
                className="bg-grey-50 hover:bg-grey-100 rounded-lg my-3 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BsPersonFill className="text-purple-800" />
                  </div>
                  <p className="pl-4">
                    {customer.id}
                  </p>
                </div>
                <p className="text-grey-600 sm:text-left text-right">
                  {customer.latestOrder}
                </p>
                <div className="sm:flex hidden justify-between items-center">
                <p className={
                      customer.orderType == "BORROW"
                        ? "bg-amber-200 hidden md:flex p-2 rounded-lg"
                        : customer.orderType == "LIQUIDATE_BORROW"
                        ? "bg-red-200 hidden md:flex p-2 rounded-lg"
                        : customer.orderType == "MINT"
                        ? "bg-green-200 hidden md:flex p-2 rounded-lg"
                        : customer.orderType == "REDEEM"
                        ? "bg-purple-200 hidden md:flex p-2 rounded-lg"
                        : customer.orderType == "REPAY_BORROW"
                        ? "bg-yellow-200 hidden md:flex p-2 rounded-lg"
                        : "bg-blue-200 hidden md:flex p-2 rounded-lg"
                    }
                // "hidden md:flex"
                >{customer.orderType}</p>
                  <BsThreeDotsVertical />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Customers;
