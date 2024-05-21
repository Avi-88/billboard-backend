import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const AddPost = () => {
  const [formData, setFormData] = useState({
    category: "",
    size: "",
    price_per_day: "",
    rating: "",
    location: "",
    title: "",
    description: "",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if any field is empty
    const isEmpty = Object.values(formData).some((value) => !value);
    if (isEmpty) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    axios
      .post("http://localhost:5000/api/post/newPost", {
        userId: user.id,
        ...formData,
      })
      .then((res) => {
        // setFormData({
        //   category: "",
        //   size: "",
        //   price_per_day: "",
        //   rating: "",
        //   location: "",
        //   title: "",
        //   description: "",
        // });
        toast({
          title: "Success",
          description: "Form submitted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: err.response.data.message,
          status: "error",
          duration: 8000,
          isClosable: true,
        });
      });
  };

  return (
    <Box maxW="lg" width="60%" mx="auto" p={6}>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Category</FormLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Select category"
          >
            <option value="Digital">Digital</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Indoor">Indoor</option>
            <option value="LED">LED</option>
            <option value="Print">Print</option>
            <option value="Interactive">Interactive</option>
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Size</FormLabel>
          <Input
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="Enter size"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Price per Day</FormLabel>
          <Input
            name="price_per_day"
            type="number"
            value={formData.price_per_day}
            onChange={handleChange}
            placeholder="Enter price per day"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Rating</FormLabel>
          <Input
            name="rating"
            type="number"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Enter rating"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Location</FormLabel>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Title</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </FormControl>
        <Button colorScheme="red" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default AddPost;
