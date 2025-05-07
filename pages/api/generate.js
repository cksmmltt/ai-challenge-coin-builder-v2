import { Configuration, OpenAIApi } from 'openai';
import multer from 'multer';
import nextConnect from 'next-connect';

const upload = multer();
const apiRoute = nextConnect();

apiRoute.use(upload.any());

apiRoute.post(async (req, res) => {
  const formData = req.body;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const generateImage = async (prompt) => {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });
    return response.data.data[0].url;
  };

  const frontImage = await generateImage(formData.frontPrompt);
  const backImage = await generateImage(formData.backPrompt);

  const quantity = parseInt(formData.quantity) || 50;
  const pricePerCoin = 5;
  const price = pricePerCoin * quantity;
  const delivery = quantity > 500 ? 30 : 14;

  res.status(200).json({
    frontImage,
    backImage,
    price,
    delivery
  });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
