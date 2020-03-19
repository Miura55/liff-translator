import os, json
from flask import Flask, render_template, request, jsonify
from ibm_watson import LanguageTranslatorV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from dotenv import load_dotenv
 
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

authenticator = IAMAuthenticator(os.environ["TRANSLATE_API_KEY"])
language_translator = LanguageTranslatorV3(
    version=os.environ["TRANSLATE_VERSION"],
    authenticator=authenticator
)

language_translator.set_service_url(os.environ["TRANSLATE_URL"])

app = Flask(__name__, static_folder='static')

@app.route("/")
def main():
    return render_template("index.html")

@app.route("/translate", methods=["POST"])
def translate():
    lang_tag = request.form["lang"]
    user_say = request.form["user_say"]
    print("target:", lang_tag, "source:", user_say)

    # translate model:https://cloud.ibm.com/docs/services/language-translator?topic=language-translator-translation-models&locale=ja#japanese
    translation = language_translator.translate(
        text=user_say,
        source="ja", 
        target="en").get_result()
    result = translation["translations"][0]["translation"]

    if lang_tag != "en":
        translation = language_translator.translate(
            text=user_say,
            source="en", 
            target=lang_tag).get_result()
        result = translation["translations"][0]["translation"]

    response = jsonify({
        "source":user_say,
        "translated":result
    })
    return response

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port="8000")