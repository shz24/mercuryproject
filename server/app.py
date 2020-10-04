import variables
import shared
from pydantic import BaseModel
import requests


def get_etsy_listings(keyword, count=10):
    r = requests.get(
        "https://openapi.etsy.com/v2/listings/active",
        params={"api_key": variables.ETSY_API_KEY, "keywords": keyword, "limit": count},
    )
    listings = []
    for res in r.json()["results"]:
        listings.append(
            {"name": res["title"], "price": float(res["price"]), "url": res["url"]}
        )
    return listings


class AmazonProductData(BaseModel):
    name: str
    price: float
    count: int
    query: str
    category: str


def get():
    return {}


def post(data: AmazonProductData):
    # Get list of items
    print(variables.IBM_API_TOKEN)
    return get_etsy_listings(data.query + " " + data.category, data.count)
