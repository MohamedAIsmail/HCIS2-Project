import torchvision
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.models.detection.mask_rcnn import MaskRCNNPredictor
import torch
from PIL import Image
import torchvision.transforms as transforms
import matplotlib.patches as patches
import matplotlib.pyplot as plt
import io
import pydicom


def intialze_model():
    num_classes = 2
    model = torchvision.models.detection.maskrcnn_resnet50_fpn(pretrained=True)
    in_features = model.roi_heads.box_predictor.cls_score.in_features
    model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)
    in_features_mask = model.roi_heads.mask_predictor.conv5_mask.in_channels
    hidden_layer = 256
    model.roi_heads.mask_predictor = MaskRCNNPredictor(in_features_mask, hidden_layer, num_classes)
    return model

def load_model(model_path):
    model = intialze_model()
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.to("cpu")
    model.eval()
    return model



def plotter(img, model_output):
    fig,ax = plt.subplots(1)
    ax.imshow(transforms.ToPILImage()(img.squeeze(0)))
    ax.imshow(transforms.ToPILImage()(model_output["masks"][0].cpu() * 255), alpha=0.5)
    rect = patches.Rectangle((model_output["boxes"][0][0].item(),
                             model_output["boxes"][0][1].item()),
                             model_output["boxes"][0][2].item() - model_output["boxes"][0][0].item(),
                             model_output["boxes"][0][3].item() - model_output["boxes"][0][1].item(),
                             linewidth=1,edgecolor='r',facecolor='none')
    ax.add_patch(rect)
    ax.axis('off')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return buf


def pridect(model, img):
    width, height = 256, 256
    image = img.resize((width, height), resample=Image.BILINEAR)
    image = transforms.ToTensor()(image).reshape(3, 256, 256).to("cpu").unsqueeze(0)
    prediction = model(image)[0]
    # try:
    masked_image = plotter(image, prediction)
    return masked_image
    # except:
    #     return img