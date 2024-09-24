import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { courseApi } from "~/apis/courseApi";
import { FormatPriceDiscount, FormatPriceSaleCart, FormatPriceTotalCart } from '~/components/table/Format';
import { removeFromCart } from "~/redux/slices/cartSlice";

const useCartData = () => {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const user = useSelector((state) => state.auth.user);

    const [carts, setCarts] = useState([]);
    const [estimated, setEstimated] = useState(0);
    const [total, setTotal] = useState(0);
    const [discountedTotal, setDiscountedTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mangMoi = cart?.filter(item => user?.courses?.includes(item));
        if (mangMoi.length > 0) {
            mangMoi.forEach(item => {
                dispatch(removeFromCart(item));
            });
        }

        const formatPrices = (items) => {
            return items.map(item => ({
                ...item,
                price: item.price * (1 - item.sale / 100)
            }));
        };

        courseApi.cart({ ids: cart })
            .then((res) => {
                setCarts(formatPrices(res));
                setEstimated(FormatPriceTotalCart(res));
                setDiscountedTotal(FormatPriceDiscount(res));
                setTotal(FormatPriceSaleCart(res));
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            })
    }, [cart, dispatch, user]);

    return { carts, estimated, total, discountedTotal, loading };
};

export default useCartData;
