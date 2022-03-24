import { useState, useEffect } from "react";
import Web3 from "web3";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import NFT from "../NFT.json";
import ASIX_TOKEN from "../ASIX_TOKEN.json";
import marketContractFile from "../NFTMarketPlace.json";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useLocation, useParams } from "react-router-dom";

const Details = (props) => {
  const [provide, setProvider] = useState(props.provider);
  const [history, setHistory] = useState([]);
  const [account, setAccount] = useState();
  const [web3Api, setWe3Api] = useState({
    provider: null,
    web3: null,
  });
  const tokenId = useParams().tokenId;
  useEffect(() => {
    setProvider(props.provider);
  });

  const loadProvider = async () => {
    const provider = props.provider;
    if (provider) {
      providerChanged(provider);
      setWe3Api({
        provider,
        web3: new Web3(provider),
      });
    }
  };

  useEffect(() => {
    loadProvider();
  }, [provide]);

  const providerChanged = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload());
    provider.on("chainChanged", (_) => window.location.reload());
  };

  // Today Pick
  const [nftAddress, setNFtAddress] = useState(null);
  const [marketAddress, setMarketAddress] = useState(null);
  const [nftContract, setNFtContract] = useState(null);
  const [marketContract, setMarketContract] = useState(null);
  const [unsoldItems, setUnsoldItems] = useState([]);
  //   const indexOfunsold = unsoldItems.length;

  useEffect(async () => {
    await LoadContracts();
    await History();
  }, [web3Api.web3]);

  const LoadContracts = async () => {
    //Paths of Json File

    // const accounts = await web3.eth.getAccounts();

    const markrtAbi = marketContractFile.abi;
    const nFTAbi = NFT.abi;

    const netWorkId = await web3Api.web3.eth.net.getId();

    const accounts = await web3Api.web3.eth.getAccounts();
    setAccount(accounts[0]);

    // const nftNetWorkObject = NFT.networks[netWorkId];
    // const nftMarketWorkObject = marketContractFile.networks[netWorkId];
    if (netWorkId === 97) {
      const nftAddress = NFT.address;
      setNFtAddress(nftAddress);
      const marketAddress = marketContractFile.address;
      setMarketAddress(marketAddress);

      const deployedNftContract = await new web3Api.web3.eth.Contract(
        nFTAbi,
        nftAddress
      );
      setNFtContract(deployedNftContract);
      const deployedMarketContract = await new web3Api.web3.eth.Contract(
        markrtAbi,
        marketAddress
      );
      setMarketContract(deployedMarketContract);

      //Fetch all unsold items
      const data = await deployedMarketContract.methods
        .getAllUnsoldItems()
        .call();
      // const items = await Promise.all(
      data.map(async (item) => {
        const nftUrl = await deployedNftContract.methods
          .tokenURI(item.tokenId)
          .call();
        // const priceToWei = Web3.utils.fromWei(item.price.toString(), "ether");
        const priceToken = formatUnits(item.price.toString(), 9);
        const metaData = await axios.get(nftUrl);
        //TODO: fix this object
        let myItem = {
          price: priceToken,
          itemId: item.id,
          owner: item.owner,
          seller: item.seller,
          image: metaData.data.image,
          name: metaData.data.name,
          description: metaData.data.description,
        };

        if (item.id === tokenId) {
          console.log(1);
          setUnsoldItems(myItem);
        }
      });
    } else {
      window.alert("You are at Wrong Netweok, Connect with Roposten Please");
    }
  };

  return (
    <div>
      <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">Edit Items</h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>Edit Items</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="tf-section tf-item-details">
        <div className="themesflat-container">
          {unsoldItems.length !== 0 && (
            <div className="row">
              <div className="col-xl-6 col-md-12">
                <div className="content-left">
                  <div className="media">
                    <img
                      src={unsoldItems.image}
                      alt="Axies"
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-md-12">
                <div className="form-create-item">
                  <div className="flat-tabs tab-create-item">
                    <Tabs>
                      <h4 className="title-create-item">Title</h4>
                      <input
                        type="text"
                        readOnly
                        placeholder="Item Name"
                        value={unsoldItems.name}
                      />
                      <br></br>
                      <br></br>
                      <h4 className="title-create-item">Price</h4>
                      <input
                        type="text"
                        placeholder="Enter price for one item (ASIX)"
                      />
                      <br></br>
                      <br></br>
                      <br></br>
                      <h4 className="title-create-item">Description</h4>
                      <textarea
                        readOnly
                        placeholder="e.g. “This is very limited item”"
                      >
                        {unsoldItems.description}
                      </textarea>
                      <br></br>
                      <br></br>
                      <br></br>

                      <button
                        class="fl-button pri-3"
                        //   onClick={createMarketItem}
                      >
                        <span
                          style={{
                            color: "#fff",
                          }}
                        >
                          Sale NFT
                        </span>
                      </button>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
