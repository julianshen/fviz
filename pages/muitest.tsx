import { Box, Button, Container, Typography } from "@material-ui/core";

export default function Muitest() {
    return (
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Next.js example
          </Typography>
          <Button variant="contained" color="primary">
            Go to the main page
          </Button>
        </Box>
      </Container>
    );
  }