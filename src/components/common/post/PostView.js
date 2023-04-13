import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material"
import React from "react"
import PostHeader from "./PostHeader"

const PostView = ({ post, setEdit }) => {
  return (
    <Card sx={style}>
      <CardHeader title={post.title} />
      <Divider />
      <CardContent sx={{ maxHeight: "400px", overflow: "auto" }}>
        <Typography>{post.content}</Typography>
      </CardContent>
      <Divider />
      <PostHeader post={post} setEdit={setEdit} />
    </Card>
  )
}

const style = {
  maxWidth: "500px",
  maxHeight: "600px",
  height: "fit-content",
  width: "fit-content",
  marginBottom: "20px",
}

export default PostView
