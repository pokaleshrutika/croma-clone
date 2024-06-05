import React, { useEffect, useState } from "react";
import Style from "./AllProduct.module.css";
import ProductCard from "../SingleCard/ProductCard";
import { useSearchParams } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

const AllProduct = () => {
  const [ProductList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortedProductList, setSortedProductList] = useState([]);
  const [sortOrder, setSortOrder] = useState();
  const [range, setRange] = useState(135000);
  const [ratting, setRatting] = useState(3);
  const [sellerTag, setSellerTag] = useState("");
  const [searchParams] = useSearchParams();
  const searchProductName = searchParams.get("product_name");

  const fetchProductList = async (searchName) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://academics.newtonschool.co/api/v1/ecommerce/electronics/products?limit=1000${
          searchName && `&search={"name":"${searchName}"}`
        }`,
        {
          method: "GET",
          headers: {
            projectId: "f104bi07c490",
          },
        }
      );
      const parseData = await response.json();
      if (response.status >= 400) {
        console.log(parseData.message || "Product not Found");
        setProductList([]);
        return;
      }
      setProductList(parseData.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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
    fetchProductList(searchProductName);
  }, [searchParams]);

  useEffect(() => {
    handleApplyFilter();
  }, [sortOrder]);

  return (
    <div className={Style.mainContainer}>
      {loading && (
        <div className={Style.loading}>
          <TailSpin
            height="60"
            width="60"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      <div className={Style.AllProductContainer}>
        <div className={Style.ProductSection}>
          <div className={Style.FilterSection}>
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
              <div>Seller Tag</div>
              <select className={Style.selecttage} onChange={(e) => setSellerTag(e.target.value)}>
                <option value="">All Sellers</option>
                <option value="top rated">Top Rated</option>
                <option value="best seller">Best Seller</option>
                <option value="trending">Trending</option>
                <option value="new arrival">New arrival</option>
              </select>
            </div>
            
            <button className={Style.applyButton} onClick={handleApplyFilter}>Apply Filters</button>
            <select className={Style.selecttage} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="ascending">Low To High</option>
              <option value="descending">High To Low</option>
            </select>
          </div>
          {ProductList && ProductList.length === 0 && (
            <p className={Style.productNotFount}>Products not found!</p>
          )}
          {sortedProductList.length > 0
            ? sortedProductList.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            : ProductList.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
