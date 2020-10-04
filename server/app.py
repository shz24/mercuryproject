import variables
import shared
from pydantic import BaseModel
import requests
import json
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, KeywordsOptions

authenticator = IAMAuthenticator(variables.IBM_API_KEY)
natural_language_understanding = NaturalLanguageUnderstandingV1(
    version="2020-08-01", authenticator=authenticator
)
natural_language_understanding.set_service_url(variables.IBM_API_URL)


def get_etsy_image_url(listing_id):
    r = requests.get(
        f"https://openapi.etsy.com/v2/listings/{listing_id}/images",
        params={"api_key": variables.ETSY_API_KEY},
    )
    return r.json()["results"][0]["url_170x135"]


def get_etsy_listings(keyword, count=10):
    r = requests.get(
        "https://openapi.etsy.com/v2/listings/active",
        params={"api_key": variables.ETSY_API_KEY, "keywords": keyword, "limit": count},
    )
    listings = []
    for res in r.json()["results"]:
        listings.append(
            {
                "name": res["title"],
                "price": float(res["price"]),
                "url": res["url"],
                "description": res["description"],
                "image_url": get_etsy_image_url(res["listing_id"]),
            }
        )
    return listings


class AmazonProductData(BaseModel):
    name: str
    price: str
    count: int
    query: str
    category: str


def get():
    return {}


def post(data: AmazonProductData):
    # Get list of items
    listing = []
    try:
        response = natural_language_understanding.analyze(
            text=data.name,
            features=Features(
                keywords=KeywordsOptions(sentiment=False, emotion=False, limit=1)
            ),
        ).get_result()
        keyword = response["keywords"][0]["text"]
        listing = get_etsy_listings(keyword, data.count)
    except:
        print("Error")
    if len(listing) == 0:
        print("Number of listing was 0")
        return get_etsy_listings(data.query + " " + data.category, data.count)
    return get_etsy_listings(keyword, data.count)
