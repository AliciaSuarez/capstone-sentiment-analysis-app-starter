import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import sequence
import tensorflow as tf
from flask import Flask, render_template, request
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Initialize the Flask app
app = Flask(__name__)

# Initialize the VADER Sentiment Analyzer
analyzer = SentimentIntensityAnalyzer()

# Load the custom Keras model and tokenizer at the start
model = None
tokenizer = None

def load_keras_model():
    global model
    # Load the SavedModel format model
    model = load_model('models/uci_sentimentanalysis.h5')

def load_tokenizer():
    global tokenizer
    with open('models/tokenizer.pickle', 'rb') as handle:
        tokenizer = pickle.load(handle)

# Initialize the model and tokenizer when the app starts
@app.before_first_request
def before_first_request():
    load_keras_model()
    load_tokenizer()

# Function to perform sentiment analysis using the custom model
def sentiment_analysis(input_text):
    user_sequences = tokenizer.texts_to_sequences([input_text])
    user_sequences_matrix = sequence.pad_sequences(user_sequences, maxlen=1225)
    prediction = model.predict(user_sequences_matrix)
    return round(float(prediction[0][0]), 2)

@app.route('/', methods=['GET', 'POST'])
def index():
    sentiment = None
    if request.method == 'POST':
        # Get the text input from the form
        text = request.form.get("user_text")
        
        # Calculate sentiment scores using VADER
        sentiment = analyzer.polarity_scores(text)
        
        # Now calculate sentiment using the custom model
        custom_sentiment = sentiment_analysis(text)
        
        # Add the custom model sentiment score to the results
        sentiment["custom model positive"] = custom_sentiment
    
    # Render the form and pass the sentiment scores if available
    return render_template('form.html', sentiment=sentiment)

if __name__ == '__main__':
    app.run(debug=True)
