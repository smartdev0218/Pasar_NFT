import React, { useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CardModal from "./CardModal";
import Web3 from "web3";
import { useLocation } from "react-router-dom";

const TodayPicks = (props) => {
  const data = props.nfts;
  // console.log(web3Api);

  const location = useLocation();
  console.log(location.pathname);
  const [visible, setVisible] = useState(8);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };
  const [modalShow, setModalShow] = useState(false);

  return (
    <Fragment>
      <section className="tf-section today-pick">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="heading-live-auctions mg-bt-21">
                <h2 className="tf-title pad-l-7">{props.title}</h2>
                <Link to="/" className="exp style2">
                  EXPLORE MORE
                </Link>
              </div>
            </div>
            {props.nfts.map((item, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                <div className={`sc-card-product`}>
                  <div className="card-media">
                    {location.pathname === "/" ? (
                      <Link to={`/details/${item.itemId}`}>
                        <img
                          src={item.image}
                          style={{
                            height: "280px",
                          }}
                          alt="axies"
                        />
                      </Link>
                    ) : (
                      <a>
                        <img
                          src={item.image}
                          style={{
                            height: "280px",
                          }}
                          alt="axies"
                        />
                      </a>
                    )}

                    {/* <Link to="/" className="wishlist-button heart">
                        <span className="number-like">20</span>
                      </Link> */}
                  </div>
                  <div className="card-title">
                    <h5 className="style2">
                      {location.pathname === "/" ? (
                        <Link to={`/details/${item.itemId}`}>{item.name}</Link>
                      ) : (
                        <a>{item.name}</a>
                      )}
                    </h5>
                    {/* <div className="tags">Kill</div> */}
                  </div>
                  <div className="meta-info">
                    <div className="author">
                      <div className="info">
                        <span>Owned By</span>
                        <h6>
                          {" "}
                          {location.pathname === "/" ? (
                            <Link to={`/details/${item.itemId}`}>
                              {location.pathname === "/"
                                ? String(item.seller).substring(0, 6) +
                                  "..." +
                                  String(item.seller).substring(38)
                                : String(item.owner).substring(0, 6) +
                                  "..." +
                                  String(item.owner).substring(38)}
                            </Link>
                          ) : (
                            <a>
                              {location.pathname === "/"
                                ? String(item.seller).substring(0, 6) +
                                  "..." +
                                  String(item.seller).substring(38)
                                : String(item.owner).substring(0, 6) +
                                  "..." +
                                  String(item.owner).substring(38)}
                            </a>
                          )}{" "}
                        </h6>
                      </div>
                    </div>
                    <div className="price">
                      <span>Current Price</span>
                      <h5
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        {" "}
                        {Web3.utils.fromWei(
                          Web3.utils.toWei(item.price.toString(), "ether"),
                          "ether"
                        )}{" "}
                        ASIX
                      </h5>
                    </div>
                  </div>
                  {props.desc && <p className="decs">{item.description}</p>}
                  <p></p>
                  <div className="card-bottom">
                    {location.pathname !== "/purchased" &&
                      location.pathname !== "/dashboard" && (
                        <button
                          className="sc-button style bag fl-button pri-3 no-bg"
                          onClick={() => props.buyNFT(item)}
                        >
                          <span>Buy NFT</span>
                        </button>
                      )}
                    {location.pathname === "/dashboard" && (
                      <Link
                        to={`/details/${item.itemId}`}
                        class="sc-button fl-button pri-3 no-bg"
                      >
                        <span>View Details</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {visible < data.length && (
              <div className="col-md-12 wrap-inner load-more text-center">
                <Link
                  to="#"
                  id="load-more"
                  className="sc-button loadmore fl-button pri-3"
                  onClick={showMoreItems}
                >
                  <span>Load More</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      <CardModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

TodayPicks.propTypes = {
  data: PropTypes.array.isRequired,
};

export default TodayPicks;
