import React from "react";
import AddIcon from "@material-ui/icons/Add";
import Clear from "@material-ui/icons/Clear";
import {
  Fab,
  Zoom,
  Card,
  CardMedia,
  CardContent,
  ButtonBase
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

function ContentBox(props) {
  const { content, classes } = props;
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} style={{ position: "relative" }}>
      <Card className={classes.card}>
        <ButtonBase
          component="div"
          onClick={() => props.cardPressed()}
          className={classes.buttonBase}
          style={{ height: "100%", display: "block" }}
        >
          <CardMedia
            className={classes.media}
            image={content.imgcontent}
            title={content.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              {content.name}
            </Typography>
            <Typography gutterBottom variant="body2">
              {content.beschreibung}
            </Typography>
          </CardContent>
        </ButtonBase>
      </Card>
      {props.activeAdd ? (
        <Zoom in={!props.checked}>
          <Fab
            onClick={() => props.newBoxPressed()}
            style={{ backgroundColor: "#21BEF3" }}
            aria-label="Add"
            className={classes.newAdd}
          >
            <AddIcon style={{ color: "white" }} />
          </Fab>
        </Zoom>
      ) : null}
      <Zoom in={!props.checked}>
        <Fab
          onClick={() => props.cancelBoxPressed()}
          style={{ backgroundColor: "white" }}
          size="small"
          aria-label="Delete"
          className={classes.newCancel}
        >
          <Clear />
        </Fab>
      </Zoom>
    </Grid>
  );
}
export default ContentBox;
