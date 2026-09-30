import { Cloudinary } from "@cloudinary/url-gen/index";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";

export const cld = new Cloudinary({
  cloud: {
    cloudName: "pnvel4tk",
  },
});

export const cloudinaryImage = (publicId: string) =>
  cld.image(publicId).delivery(format("auto")).delivery(quality("auto")).toURL();
