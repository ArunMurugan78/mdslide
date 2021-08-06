import { FC } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

export interface SlideNavigatorProps {
  onAddNewSlide: () => void;
}

interface NewSlideButtonProps {
  onClick: () => void;
}

const NewSlideButton: FC<NewSlideButtonProps> = (props) => {
  const { onClick } = props;

  return (
    <IconButton
      colorScheme="black"
      height="50px"
      width="75px"
      onClick={onClick}
      _hover={{ bg: "black", color: "white" }}
      variant="outline"
      aria-label="Add new Slide"
      icon={<AddIcon />}
    />
  );
};

export const SlideNavigator: FC<SlideNavigatorProps> = (props) => {
  const { onAddNewSlide } = props;

  return (
    <Box p="20px" bg="#F4F4F2" width="100%" height="100%">
      <NewSlideButton onClick={onAddNewSlide} />
    </Box>
  );
};
