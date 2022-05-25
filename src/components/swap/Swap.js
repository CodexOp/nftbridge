import React, {useState, useRef} from 'react';
import './swap.css';
import './nft.css'
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import logo from '../../images/logo.png'
import { useMoralis } from "react-moralis";
import { useMoralisWeb3Api } from "react-moralis";
import { AiOutlineClose } from 'react-icons/ai';
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import values from "../../values.json"
import stakingAbi from '../../abi/staking.json';
import tokenAbi from '../../abi/token.json';
import bridgeAbi from '../../abi/bridge.json';


const Swap = () => {
  let [connectedWallet, setConnectedWallet] = React.useState(false);
  let [walletAddress, setWalletAddress] = React.useState("Connect");
  const [swap, setSwap] = useState(false)
  const [modal, setModal] = useState(false)
  const [chainerror, setChainError] = useState()
  const [valve, setValve] = useState(<div className='swap_element'> <FaEthereum /> ETHEREUM</div>)
  const [valve2, setValve2] = useState(<div className='swap_element'> <SiBinance /> BINANCE</div>)
  const [imageUrls, setImageUrls] = useState([]);
  const Web3Api = useMoralisWeb3Api();
  const [Nftimage, setNftimage] = useState();
  const [chainId, setChainId] = useState(0);
  const [bridgeState, setBridgeState] = useState("SWAP");

  let [_signer, _setSigner]= React.useState(0);
  let [_provider, _setProvider]= React.useState(0);
  let web3ModalRef = useRef();

  let chainData = {
    56 : {
      chainId: ethers.utils.hexlify(56),
      chainName: "Binance Network",
      nativeCurrency: {
        name: "Binance",
        symbol: "BNB", // 2-6 characters long
        decimals: 18
      },
      rpcUrls: ["https://bsc-dataseed.binance.org/"],
      blockExplorerUrls: ["https://bscscan.com"],
    },
    1 : {
      
    }
  }

  React.useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "binance",
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            rpc: {
              56: values.rpcUrl
            } // required
          }
        }
      },
    });

  }, []);

  React.useEffect(() => {
    if (!modal){
      setBridgeState("SWAP");
    }
  }, [modal]);

React.useEffect(() => {
  fetchSearchNFTs();
}, [chainId, walletAddress]);


  const connectWallet = async () => {
    try {
      if (!connectedWallet) await getSignerOrProvider(true);
      else disconnectWallet();
    } catch (error) {
      console.log(" error Bhai", error);
    }
  };

  async function disconnectWallet () {
    try{
      await web3ModalRef.current.clearCachedProvider();
      window.localStorage.clear();
      setConnectedWallet(false);
      setWalletAddress("Connect")
      _setProvider("");
      _setSigner("");
      setChainId (0)
    }catch(err){
      console.log(err);
    }
  }

  const getSignerOrProvider = async (needSigner = false) => {
    try{
      const _provider = new providers.JsonRpcProvider(values.rpcUrl);
      _setProvider(_provider);
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const { chainId } = await web3Provider.getNetwork();
      console.log ("ChainId: ", chainId);
      setChainId(chainId);
      // if (chainId !== 4) {
      //   alert("USE RINKEEBY NETWORK");
      //   throw new Error("Change network to Rinkeby");
      // }

      if (chainId != 56){
        // switchNetwork(web3Provider);
      }

      if (needSigner) {
        const signer = web3Provider.getSigner();
        _setSigner(signer);
        let temp = await signer.getAddress();
        setWalletAddress(temp.toString());
      }
      setConnectedWallet(true);
      provider.on("accountsChanged", (accounts) => {
        console.log(accounts);
        connectWallet();
      });
    } catch (error) {
      console.log (error);
      const provider = new providers.JsonRpcProvider(values.rpcUrl);
      _setProvider(provider);
    }
  };

  async function switchNetwork (library) {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexlify(56) }],
      });
      console.log ("HIhIHIHIHIHI")
      
    } catch (switchError) {
        console.log ("HIIIIIIIIIIIIIIIII", switchError)
        // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              chainData[56]
            ],
          });
        } catch (addError) {
          throw addError;
        }
      }
    }
  }

  async function fetchSearchNFTs () {
    try {
      const options = { 
        chain: values.moralisId[chainId],
        address: walletAddress,
        token_address: values.nft[chainId]
      };
      console.log("Trading in options",options);
      const NFTs = await Web3Api.account.getNFTsForContract(options);
      console.log(NFTs);

      let _imagesUrls= [];
      let responses = [];
      for (let i=0; i<NFTs.result.length; i++) {
        let _nft = (NFTs.result)[i];
        let url = fixUrl (_nft.token_uri);
        let response = fetch(url);
        responses.push(response);
      }
      responses = await Promise.all(responses);
      let datas= [];
      for (let i=0; i<responses.length; i++) {
        let data = responses[i].json();
        datas.push(data);
      }
      datas = await Promise.all(datas);
      console.log ("datas URL: ", datas);
      
      for (let i=0; i<datas.length; i++) {
        let _url = fixUrl (datas[i].image)
          console.log ("_url", _url);
          _imagesUrls.push({
            url: _url, 
            id: NFTs.result[i].token_id, 
            name: datas[i].name, 
            description: datas[i].description
          });
      }
      _imagesUrls.reverse();
      setImageUrls(_imagesUrls);

      function fixUrl (url) {
        if (url.startsWith("ipfs")){
          return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(-1)[0];
        }else {
          return url + "?format=json";
        }
      }
      
    } catch (err) {
    console.log ("Nft ki esi ki tesi:", err);
  }
  };
 
  const swapping = () => {
    setSwap(!swap)

    if(swap === false){
      setValve(<div className='swap_element'> <FaEthereum /> ETHEREUM</div>)
      setValve2(<div className='swap_element'> <SiBinance /> BINANCE</div>)
    }

    else{
      setValve(<div className='swap_element'> <SiBinance /> BINANCE</div>)
      setValve2(<div className='swap_element'> <FaEthereum /> ETHEREUM</div>)
    }
  }

  const showmodal = () => {
    setModal(!modal)

  }

  const closeModal = () =>{
    setModal(!modal)

  }

  function displaynft () {
    if (imageUrls.length == 0) return <>You don't have any NFT on the current chain 🙁</>
    return (
      imageUrls.length >= 0  && imageUrls.map((value, key) => (<img onClick={(e) => {setNftimage(value); showmodal(e)}} src={value.url} className='nftimages' alt={value.id} />))
    )
  }

  function checkChain () {
    console.log ("Checking chain....", chainId);

    if (chainId == 0) return <>Please Connect to MetaMask</>
    else{
      if (chainId == 1){
        if (!swap) return <>You are on Correct network</>
        else return <>You are on wrong network</>
      }else if (chainId == 56){
        if (swap) return <>You are on Correct network</>
        else return <>You are on wrong network</>
      }else {
        return <>You are on wrong network</>
      }
    }
  }

  function handleBridge () {
    try{
      
    } catch(err){
      console.log(err);
    }
  }
  

  return (

    
      
    <div className='dash'>
        <div>
  <div className='navbar_outer'>
            
            <div className='logo_container'><img className="logo" alt="logo" src={logo} /><h2>METALOOP</h2></div>
            <div className='connect_wallet_container'>
                <button className='wallet' onClick= {connectWallet} >{walletAddress === 'Connect' ? 'Connect' : `${walletAddress.slice(0,4)}...${walletAddress.slice(-4,-1)}`}</button>
            </div>
        </div>
        </div>
        {modal ? <div className='modal_container'>
          <AiOutlineClose className='close_icon' onClick={(e) => closeModal(e)}/>
        <div className='modal_inner'>
        <div className='left_section'>
          <img src={Nftimage.url} alt='nft' className='modal_image'/>
        </div>
      <div className='right_section'>
        <div className='right_info'>
        <p className='tokenid'>Token Id - {Nftimage.id}</p> 
        <p className='chain'>{checkChain()}</p> 
          <div className="input1">
                <div className='maxToken'>
                <p>{valve}</p>
                </div>
                </div>
                <div className='inputbox'>
                <div className='arrow'>
                  <BsFillArrowDownCircleFill className='swapp_arrow' onClick={() => swapping()}/>
                </div>
                <div className="input2">
                <div className='maxToken'>
                <p>{valve2}</p>
                </div>
                </div>
            </div>

            <p className='showError'>{chainerror}</p>
            <div className='all_buttons'>
                <button className='greenButton' onClick={handleBridge} >{bridgeState}</button>
            </div>
        </div>
      </div>
        </div>
       
      </div> : 
          <div className='landing'>

      <div className='stak_box'>  
            <div className='stak_heading'>
                <h2>NFT BRIDGE</h2>
                <p>Select The NFT Which You Want To Swap</p>
            </div>
        
            {/* <Timer /> */}
          

            <div className='inputs'>
            <div className='inputbox'>
            <div className="input_amount">

                </div>
                
                <div className='nftimages_container'>
               { displaynft()}
                </div>

                
         
            </div>
            </div>


           
          
            </div>
            </div>}
 
    

    </div>
  )
}


export default Swap