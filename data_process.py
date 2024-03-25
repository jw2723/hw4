import pandas as pd

df = pd.read_csv('/Users/jingqiwang/Desktop/In Progress/Cornell University/INFO 5311 visualization/hw4/comma-survey.csv')

opinion_column = "In your opinion, which sentence is more gramatically correct?"

# filter with and without commas
with_comma = df[opinion_column] == "It's important for a person to be honest, kind, and loyal."
without_comma = df[opinion_column] == "It's important for a person to be honest, kind and loyal."

# count occurrences for each
with_comma_count = with_comma.sum()
without_comma_count = without_comma.sum()

# calculate percentages
total = with_comma_count + without_comma_count
with_comma_percentage = (with_comma_count / total) * 100
without_comma_percentage = (without_comma_count / total) * 100

# export percentage as processed data for json
processed_data = pd.DataFrame({
    'Preference': ['With Oxford Comma', 'Without Oxford Comma'],
    'Percentage': [with_comma_percentage, without_comma_percentage]
})

processed_data.to_json('processed_data.json', orient='records', indent=2)