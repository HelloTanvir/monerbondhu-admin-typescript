import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    // eslint-disable-next-line prettier/prettier
    Typography
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { ProductsData } from '../products/Products';

interface Props {
    product: {
        _id: string;
        name: string;
        dis: string;
        price: number | string;
        image: string;
        position: number;
    };
    isEditing?: boolean;
    allProducts?: ProductsData[];
    updatedProduct?: ProductsData | string | null;
    setUpdatedProduct?: React.Dispatch<React.SetStateAction<string | ProductsData | null>>;
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        maxWidth: 450,
    },
    media: {
        height: 250,
    },
});

const OrderedProduct: React.FC<Props> = ({
    product,
    isEditing,
    allProducts,
    updatedProduct,
    setUpdatedProduct,
}): React.ReactElement => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState<'paper' | 'body'>('paper');

    const handleClickOpen = (scrollType: 'paper' | 'body') => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        if (open) {
            if (descriptionElementRef.current) {
                descriptionElementRef.current.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <Button
                color="primary"
                size="medium"
                style={{ margin: 0, padding: 0, textTransform: 'unset', display: 'inline' }}
                onClick={handleClickOpen('body')}
            >
                <img src={product.image} alt="" width="100px" height="100px" />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Ordered Product</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        {isEditing ? (
                            <FormControl fullWidth>
                                <InputLabel>Select a product</InputLabel>
                                <Select
                                    value={updatedProduct}
                                    onChange={(e) => {
                                        if (
                                            typeof e.target.value === 'string' &&
                                            setUpdatedProduct !== undefined
                                        ) {
                                            setUpdatedProduct(e.target.value);
                                            handleClose();
                                        }
                                    }}
                                >
                                    {allProducts?.map((p, index) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <MenuItem key={index} value={JSON.stringify(p)}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={p.image} alt="" width={50} height={50} />
                                                <span style={{ marginLeft: 10 }}>{p.name}</span>
                                            </div>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <Card className={classes.root}>
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        image={product.image}
                                        title="Product"
                                    />

                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {product.name}
                                        </Typography>

                                        <Typography>
                                            <Typography
                                                variant="h6"
                                                color="textPrimary"
                                                style={{ fontSize: 16, display: 'inline-block' }}
                                            >
                                                Price:
                                            </Typography>{' '}
                                            {product.price} <br />
                                            <Typography
                                                variant="h6"
                                                color="textPrimary"
                                                style={{ fontSize: 16, display: 'inline-block' }}
                                            >
                                                Description:
                                            </Typography>{' '}
                                            {product.dis}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OrderedProduct;
