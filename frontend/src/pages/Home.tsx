import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip,
  CardMedia,
  CardActions,
  useTheme,
  useMediaQuery,
  Grow,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Transport } from '../types';
import { transportService } from '../services/api';
import BookingDialog from '../components/BookingDialog';

const Home: React.FC = () => {
    const [transports, setTransports] = useState<Transport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchTransports = async () => {
            try {
                const data = await transportService.getTransports();
                setTransports(data);
            } catch (error) {
                console.error('Error fetching transports:', error);
                // Add sample data if API fails
                setTransports([
                    {
                        id: '1',
                        name: 'Express Train to Mumbai',
                        type: 'train',
                        from: 'Delhi',
                        to: 'Mumbai',
                        departureTime: '2024-03-20T08:00:00Z',
                        arrivalTime: '2024-03-20T20:00:00Z',
                        price: 1500,
                        seats: 50,
                        availableSeats: 50
                    },
                    {
                        id: '2',
                        name: 'Deluxe Bus to Jaipur',
                        type: 'bus',
                        from: 'Delhi',
                        to: 'Jaipur',
                        departureTime: '2024-03-21T07:00:00Z',
                        arrivalTime: '2024-03-21T12:00:00Z',
                        price: 800,
                        seats: 30,
                        availableSeats: 30
                    },
                    {
                        id: '3',
                        name: 'Flight to Bangalore',
                        type: 'flight',
                        from: 'Delhi',
                        to: 'Bangalore',
                        departureTime: '2024-03-22T10:00:00Z',
                        arrivalTime: '2024-03-22T12:30:00Z',
                        price: 4500,
                        seats: 120,
                        availableSeats: 120
                    },
                    {
                        id: '4',
                        name: 'Overnight Train to Kolkata',
                        type: 'train',
                        from: 'Delhi',
                        to: 'Kolkata',
                        departureTime: '2024-03-23T22:00:00Z',
                        arrivalTime: '2024-03-24T10:00:00Z',
                        price: 1200,
                        seats: 40,
                        availableSeats: 40
                    },
                    {
                        id: '5',
                        name: 'Premium Bus to Agra',
                        type: 'bus',
                        from: 'Delhi',
                        to: 'Agra',
                        departureTime: '2024-03-24T06:00:00Z',
                        arrivalTime: '2024-03-24T09:00:00Z',
                        price: 600,
                        seats: 25,
                        availableSeats: 25
                    },
                    {
                        id: '6',
                        name: 'Flight to Chennai',
                        type: 'flight',
                        from: 'Delhi',
                        to: 'Chennai',
                        departureTime: '2024-03-25T14:00:00Z',
                        arrivalTime: '2024-03-25T16:45:00Z',
                        price: 4200,
                        seats: 90,
                        availableSeats: 90
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransports();
    }, []);

    const handleBookNow = (transport: Transport) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setSelectedTransport(transport);
    };

    const handleBookingSuccess = () => {
        setBookingSuccess(true);
        // Refresh transports to update available seats
        const fetchTransports = async () => {
            try {
                const data = await transportService.getTransports();
                setTransports(data);
            } catch (error) {
                console.error('Error fetching transports:', error);
            }
        };
        fetchTransports();
    };

    const getTransportImage = (type: string) => {
        switch (type) {
            case 'train':
                return 'https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?ixlib=rb-4.0.3';
            case 'flight':
                return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3';
            case 'bus':
                return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3';
            default:
                return 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3';
        }
    };

    if (loading) {
        return (
            <Container sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '80vh' 
            }}>
                <Typography variant="h6" align="center">Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                align="center"
                sx={{ 
                    mb: 4,
                    fontWeight: 'bold',
                    color: theme.palette.primary.main
                }}
            >
                Available Transport Options
            </Typography>
            <Grid container spacing={3}>
                {transports.map((transport, index) => (
                    <Grid key={transport.id} item xs={12} sm={6} md={4}>
                        <Grow in={true} timeout={index * 200}>
                            <Card
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: theme.shadows[10],
                                    },
                                    transition: 'all 0.3s ease-in-out'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={getTransportImage(transport.type)}
                                    alt={transport.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" component="h2" gutterBottom>
                                            {transport.name}
                                        </Typography>
                                        <Chip 
                                            label={transport.type} 
                                            color="primary" 
                                            size="small"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            <strong>From:</strong> {transport.from}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            <strong>To:</strong> {transport.to}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Departure:</strong> {new Date(transport.departureTime).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Arrival:</strong> {new Date(transport.arrivalTime).toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" color="primary">
                                            ₹{transport.price}
                                        </Typography>
                                        <Typography variant="body2" color={transport.availableSeats > 0 ? 'success.main' : 'error.main'}>
                                            {transport.availableSeats > 0 
                                                ? `${transport.availableSeats} seats available`
                                                : 'Sold Out'}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ p: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={() => handleBookNow(transport)}
                                        disabled={transport.availableSeats === 0}
                                        sx={{ 
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {transport.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grow>
                    </Grid>
                ))}
            </Grid>

            {selectedTransport && (
                <BookingDialog
                    open={!!selectedTransport}
                    onClose={() => setSelectedTransport(null)}
                    transport={selectedTransport}
                    onBookingSuccess={handleBookingSuccess}
                />
            )}

            <Snackbar
                open={bookingSuccess}
                autoHideDuration={6000}
                onClose={() => setBookingSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setBookingSuccess(false)} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    Booking successful! Check your bookings in the My Bookings section.
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Home; 