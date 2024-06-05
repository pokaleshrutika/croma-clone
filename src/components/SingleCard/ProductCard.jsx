// @ts-nocheck
import React, { useEffect, useState } from "react";
import Style from "./ProductCard.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import StarIcon from "@mui/icons-material/Star";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image404 from "../../assets/2e60079f1e36b5c7681f0996a79e8af4.jpg";

import { useNavigate } from "react-router-dom";
import { getRandomDecimal } from "../../utils/data";
import Login from "../LogIn/Login";

const ProductCard = ({ product, setShowLoginPage }) => {
  const rating = getRandomDecimal();
  const [wishList, setWishList] = useState(false);
  const [showFallbackImage, setShowFallbackImage] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const UserLocation = localStorage.getItem("locationDetails");
  const parseUserLocation = JSON.parse(UserLocation);
  const navigate = useNavigate();
  const toViewProduct = () => {
    navigate(`/Product/${product._id}`);
  };
  const userDetails = localStorage.getItem("userDetails");
  const parseUserDetails = JSON.parse(userDetails);
  const AddWishList = async (e) => {
    e.stopPropagation();
    try {
      if (!parseUserDetails || !parseUserDetails.token) {
        // navigate("/login");
        console.log("User details or token not found.");
        setShowLoginPage(true);
        return;
      }
      const responce = await fetch(
        "https://academics.newtonschool.co/api/v1/ecommerce/wishlist",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${parseUserDetails.token}`,
            projectId: "f104bi07c490",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
          }),
        }
      );
      const data = await responce.json();
      console.log(data);
      if (responce.status >= 400) {
        toast.error(` ${data.message}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      } else {
        setWishList(true);
        toast.success("item added to wishList Successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const notClickeble = () => {
    toast.error("Feature update soon", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  // useEffect(() => {
  //   if (product.displayImage) {
  //     setShowFallbackImage(false);
  //   }
  // }, [product]);
  return (
    <>
      <div className={Style.ProductContainer} onClick={toViewProduct}>
        <div className={Style.ProductImg}>
          <img
            src={!product.displayImage ? Image404 : product.displayImage}

            alt="Product Image"
            onError={() => {
              setShowFallbackImage(true);
            }}
          />
          <div className={Style.compare} onClick={notClickeble}>
            <CheckBoxOutlineBlankIcon />
            COMPARE
          </div>
        </div>
        <div className={Style.ProductDetails}>
          <p className={Style.ProductName}>{product.name}</p>
          <div className={Style.btnSect}>
            <button>
              {Math.floor(Math.random() * (6000 - 2000 + 1) + 2000)}
              &nbsp;off on payment OTP page
            </button>
            <button>6 Months No CostEMI</button>
          </div>
          <div className={Style.ProductRating}>
            <div>{rating}&nbsp; </div>
            <StarIcon style={{ fontSize: "16px" }} />
            &nbsp;rating
          </div>
          <div className={Style.ProductPrice}>
            <CurrencyRupeeIcon style={{ fontSize: "20px" }} />
            {product.price}.00
          </div>
          <div className={Style.tex}>(Incl. all Texes)</div>
          <div className={Style.DeliveryAddress}>
            Delivery Address: {parseUserLocation?.City},
            {parseUserLocation?.Pincode}
          </div>
          <div className={Style.StanderdDelivery}>
            Standard Delivery by Tomorrow
          </div>
        </div>
        <div className={Style.HeartIcon} onClick={AddWishList}>
          {wishList ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </div>
        <div className={Style.ShareIcon} onClick={notClickeble}>
          <ShareIcon style={{ cursor: "not-allowed" }} />
        </div>
      </div>
      <Login
        isModal
        onClose={() => {
          setShowLoginModal(false);
        }}
        isOpen={showLoginModal}
      />
    </>
  );
};

export default ProductCard;
