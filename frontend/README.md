# PAWS Frontend

Create React App frontend for PAWS.

## Run

```bash
npm install
npm start
```

Build:

```bash
npm run build
```

Set the Flask API URL in `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

The form uses native `FormData` and sends the entered values to `POST /api/predict`. The Flask backend engineers the features required by the supplied Random Forest models.

Bootstrap provides the layout/forms/navbar. MUI X Charts provides the result charts.
