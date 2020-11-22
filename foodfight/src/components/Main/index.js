import React, { useState, useEffect } from "react";
import styles from "./main.module.scss";
import axios from "axios";
import Button from "../Button";
import RaceScreen from "../RaceScreen";

export default function Main({ currentPos }) {
  const [showLetsGoBtn, setShowLetsGoBtn] = useState(true);
  const [restaurantSubmitted, setResturantSubmitted] = useState(false);
  const [selectedRestaurants, setselectedRestaurants] = useState([]);

  const [data, setData] = useState([]);

  function handleSelect(id, name, distance, price, rating, reviewCount, isClosed) {
    distance /= 10;
    distance = Math.round(distance);
    distance /= 100;
    let newPrice = price.length;

    if (selectedRestaurants.map((x) => x.id).includes(id)) {
      let updatedResturants = [];
      for (let i = 0; i < selectedRestaurants.length; i++) {
        if (!(selectedRestaurants[i].id === id)) {
          updatedResturants.push(selectedRestaurants[i]);
        }
      }
      setselectedRestaurants(updatedResturants);
    } else {
      if (selectedRestaurants.length === 5) {
        return;
      }
      let newItem = {
        id: id,
        name: name,
        distance: distance,
        price: newPrice,
        rating: rating,
        reviewCount : reviewCount,
        isClosed: isClosed,
      };
      setselectedRestaurants([newItem, ...selectedRestaurants]);
    }
  }

  function handleRestaurantSubmit() {
    // go to next page when 2 or more restaurants selected
    if(!(selectedRestaurants.length <2)){
      setResturantSubmitted(true);
    }
  }

   // if you have any more flags, add here pls
   function handleReset(){
    setShowLetsGoBtn(true);
    // setScaleDown(false);
    setResturantSubmitted(false);
    setselectedRestaurants([]);
  }

  useEffect(() => {
    console.log(selectedRestaurants);
  }, [selectedRestaurants]);
  useEffect(() => {
    if (currentPos) {
      axios
        .get(
          `http://localhost:5000/api/nearbyBusinesses/${currentPos.latitude}/${currentPos.longitude}`
        )
        .then((response) => {
          setData(response.data.result);
          console.log(response.data);
        });
    }
  }, [currentPos]);
  return (
    <div className={styles.root}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          f<span style={{ color: "black" }}>oo</span>d fight!
        </p>
        <p className={styles.subtext}>Race to decide where to eat.</p>
      </div>

      {showLetsGoBtn ? (
        <button
          onClick={() => {
            setShowLetsGoBtn(false);
          }}
          className={styles.btn}
        >
          let's go
        </button>
      ) : null}

      {data && !showLetsGoBtn && !restaurantSubmitted ? (
        <div>
          <div className={styles.restaurantList}>
            {data.map((restaurant) => {
              return (
                <div style={{ marginBottom: "10px" }}>
                  <Button
                    name={restaurant.name.substring(0, 20)}
                    onClick={() =>
                      handleSelect(
                        restaurant.id,
                        restaurant.name,
                        restaurant.distance,
                        restaurant.price,
                        restaurant.rating,
                        restaurant.review_count,
                        restaurant.is_closed
                      )
                    }
                    isClosed={restaurant.is_closed}
                    selected={selectedRestaurants
                      .map((x) => x.id)
                      .includes(restaurant.id)}
                    distance={Math.round(restaurant.distance/10)/100}
                  ></Button>
                </div>
              );
            })}
          </div>
          <div className={styles.submitButton} onClick={handleRestaurantSubmit}>
            Fight!
          </div>
        </div>
      ) : null}
      {
        restaurantSubmitted ? (
          <div>
            <RaceScreen 
              selectedRestaurants={selectedRestaurants}
            />
          </div>
        ) :null
      }
    </div>
  );
}
