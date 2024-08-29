import React from "react";
import { Box, Typography } from "@mui/material";

const FileUploadInfo = ({ file }) => {
  if (!file) return null;

  return (
    <Box ml={2} display="inline-flex" alignItems="center">
      <Typography variant="body2" color="textSecondary">
        Selected file: {file.name}
      </Typography>
    </Box>
  );
};

export default FileUploadInfo;
