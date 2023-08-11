import React, { useEffect, useState } from 'react';
import './productList.scss';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { SpinnerImg } from '../../Loader/loader';
import Search from '../../Search/Search';
import { useSelector } from 'react-redux';
import { FILTER_PRODUCTS, selectFilteredProducts } from '../../../redux/features/product/filterSlice';
import { useDispatch } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import { deleteProduct, getProducts } from '../../../redux/features/product/productSlice';
import { Link } from 'react-router-dom';

const ProductList = ({products, isLoading}) => {
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredProducts);
  const dispatch = useDispatch()

  //Begin Pagination

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredProducts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  }
  //End Pagination

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  if(!products) {
    return <p>Loading...</p>
  }
  console.log({products});

  const shortenText = (text, n) => {
    if(text.length > n) {
      const shortenedText = text.substring(0,n).concat("...")
      return shortenedText
   }
   return text;
  }

  const delProduct = async(id) => {
  
    await dispatch(deleteProduct(id))
    await dispatch(getProducts())
  }

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Delete product',
      message: 'Are you sure you want to delete product?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => delProduct(id)
        },
        {
          label: 'Cancel',
        }
      ]
    });
  }
  return (
    <div className='product-list'>
      <hr />
      <div className='table'>
        <div className='--flex-between --flex-dir-column'>
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search value={search} onChange={(e) => setSearch(e.target.value)} />
          </span>
        </div>

        {isLoading && <SpinnerImg /> }

        <div className='table'>
          {!isLoading && products.length === 0 ? (
            <p>No products found, please add a product... </p>
          ): (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {
                  currentItems.map((product,index) => {
                    const {_id, name, category, price,quantity} = product
                    return (
                      <tr key={_id}>
                        <td>{index + 1}</td>
                        <td>{shortenText(name, 16)}</td>
                        <td>{category}</td>
                        <td>{"$"}{price }</td>
                        <td>{quantity}</td>
                        <td>{"$"}{price * quantity}</td>
                        <td className='icons'>
                          <span>
                            <Link to={`/product-detail/${_id}`}>
                            <AiOutlineEye size={25} color={"purple"} />
                            </Link>
                            <Link to={`/edit-product/ ${_id}`}>
                            <FaEdit size={20} color={"green"} />
                            </Link>
                            <FaTrashAlt size={20} color={"red"} onClick={() => confirmDelete(_id)} />
                          </span>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Prev"
        renderOnZeroPageCount={null}
        containerClassName='pagination'
        pageLinkClassName='page-num'
        previousLinkClassName='page-num'
        nextLinkClassName='page-num'
        activeClassName='activePage'
      />
      </div>
    </div>
  )
}

export default ProductList;
