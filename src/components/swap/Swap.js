import React, {useState} from 'react';
import './swap.css';
import './nft.css'
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import logo from '../../images/logo.png'
import { useMoralis } from "react-moralis";
import { useMoralisWeb3Api } from "react-moralis";
import { AiOutlineClose } from 'react-icons/ai';

const Swap = () => {
  const [swap, setSwap] = useState(false)
  const [modal, setModal] = useState(false)
  const [chainerror, setChainError] = useState()
  const [valve, setValve] = useState(<div className='swap_element'> <FaEthereum /> ETHEREUM</div>)
  const [valve2, setValve2] = useState(<div className='swap_element'> <SiBinance /> BINANCE</div>)
  const [imageUrls, setImageUrls] = useState([]);
  const Web3Api = useMoralisWeb3Api();

  React.useEffect(() => {
    // let _web3ModalRef = new Web3Modal({
    //   network: "binance",
    //   cacheProvider: false,
    //   providerOptions: {
    //     walletconnect: {
    //       package: WalletConnectProvider, // required
    //       options: {
    //         rpc: {
    //           56: values.rpcUrl
    //         } // required
    //       }
    //     }
    //   },
    // });
    // setWeb3ModalRef(_web3ModalRef);
    // let web3 = new Web3Modal({});
    // web3.cachedProvider()

    // connectWallet();
    // web3ModalRef.clearCachedProvider();
    // console.log ( "Hellow", _web3ModalRef.cachedProvider)
    fetchSearchNFTs();

  }, []);



  const fetchSearchNFTs = async () => {
    try {
      const options = { 
        chain: "bsc",
        address: "0xca02bb62db20cd9c486cfbbc68ebf1353eefd6f5",
        token_address: "0x0932B4D7386822CbdA970833fE815641B0347733"
      };
      console.log(options);
      const NFTs = await Web3Api.account.getNFTsForContract(options);
      console.log(NFTs);

      NFTs.result.forEach((nft)=>{
        let url = fixUrl (nft.token_uri);

        fetch(url).then((response) => response.json())
        .then(data => {
          let _url = fixUrl (data.image)
          // console.log (_url);
          imageUrls.push(_url)
        })
      })

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


  return (

    
      
    <div className='dash'>
        <div>
  <div className='navbar_outer'>
            
            <div className='logo_container'><img className="logo" alt="logo" src={logo} /><h2>METALOOP</h2></div>
            <div className='connect_wallet_container'>
                <button className='wallet' >CONNECT</button>
            </div>
        </div>
        </div>
        {modal ? <div className='modal_container'>
          <AiOutlineClose className='close_icon' onClick={(e) => closeModal(e)}/>
        <div className='modal_inner'>
        <div className='left_section'>
          <img src={imageUrls[6]} alt='nft' className='modal_image'/>
        </div>
      <div className='right_section'>
        <div className='right_info'>
        <p className='tokenid'>Token Id - 0msdfm3werm389bqa83c3rio</p> 
        <p className='chain'>Select Chain</p> 
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
                <button className='greenButton'>SWAP</button>
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
                {imageUrls.length > 0  && imageUrls.map((value, key) => <img  onClick={(e) => showmodal(e)} src={value} className='nftimages' alt={key} />)}
                </div>

                
         
            </div>
            </div>


           
          
            </div>
            </div>}
 
    

    </div>
  )
}


export default Swap