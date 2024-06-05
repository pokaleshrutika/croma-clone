import React, { useEffect, useState } from "react";
import ProductCard from "../SingleCard/ProductCard";
import { useParams } from "react-router-dom";
import Login from "../LogIn/Login";
import Style from "./SubCategory.module.css";

const SubCategory = () => {
  const { type } = useParams();
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [ProductList, setProductList] = useState([]);
  const [sortedProductList, setSortedProductList] = useState([]);
  const [sortOrder, setSortOrder] = useState();
  const [range, setRange] = useState(135000);
  const [ratting, setRatting] = useState(3);
  const [sellerTag, setSellerTag] = useState("");

  const url = `https://academics.newtonschool.co/api/v1/ecommerce/electronics/products?limit=1000&filter={"subCategory":"${type}"}`;
  const handleProductList = async () => {
    const responce = await fetch(
      // `https://academics.newtonschool.co/api/v1/ecommerce/electronics/products`,
      url,
      {
        method: "GET",
        headers: {
          projectId: "f104bi07c490",
        },
      }
    );
    const parseData = await responce.json();
    console.log(parseData.data);
    if (responce.status >= 400) {
      console.log(parseData.message || "Product not Found");
      return;
    }
    setProductList(parseData.data);
  };
  const handleApplyFilter = async () => {
    const filteredList = ProductList.filter(
      (product) =>
        parseFloat(product.price) <= parseFloat(range) &&
        (sellerTag ? product.sellerTag === sellerTag : true)
      // parseFloat(product.rating) >= parseFloat(ratting)
    );
    const sortedList = [...filteredList];
    console.log("Updated");
    setSortedProductList(
      sortedList.sort((a, b) => {
        if (sortOrder === "ascending") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      })
    );
  };

  useEffect(() => {
    if (type) {
      handleProductList();
    }
  }, [type]);

  useEffect(() => {
    handleApplyFilter();
  }, [sortOrder]);

  return (
    <div>
      {/* <div>Television & Accessories</div> */}
      <div className={Style.FilterSection}>
        {sortOrder}
        <div className={Style.sellertage}>
          <div>Price : </div>

          <div>
            <div className={Style.priceRange}>
              <div>0</div>
              <div>{range}</div>
            </div>
            <input
              type="range"
              className={Style.prevision_slider}
              min={0}
              max={150000}
              value={range}
              onChange={(e) => setRange(e.target.value)}
            />
          </div>
        </div>
        <div className={Style.sellertage}>
          <div>Rating :</div>
          <select
            className={Style.rattingOption}
            onChange={(e) => setRatting(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className={Style.sellertage}>
          <div>Seller Tag :</div>
          <select
            className={Style.selecttage}
            onChange={(e) => setSellerTag(e.target.value)}
          >
            <option value="">All Sellers</option>
            <option value="top rated">Top Rated</option>
            <option value="best seller">Best Seller</option>
            <option value="trending">Trending</option>
            <option value="new arrival">New arrival</option>
          </select>
        </div>

        <button className={Style.applyButton} onClick={handleApplyFilter}>
          Apply Filters
        </button>
        <select
          className={Style.selecttage}
          onChange={(e) => {
            setSortOrder(e.target.value);
          }}
        >
          <option value="ascending">Low To High</option>
          <option value="descending">High To Low</option>
        </select>
      </div>
      {sortedProductList.length > 0
        ? sortedProductList.map((product) => (
            <ProductCard
              product={product}
              key={product._id}
              setShowLoginPage={setShowLoginPage}
            />
          ))
        : ProductList.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      <Login onClose={() => setShowLoginPage(false)} isOpen={showLoginPage} />
    </div>
  );
};

export default SubCategory;
