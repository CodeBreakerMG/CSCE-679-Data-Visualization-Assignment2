import pandas as pd

# Load the CSV file
file_path = "temperature_daily.csv"  # Replace with your actual file path
df = pd.read_csv(file_path)

# Sample 10% of the rows (including the header)
df_sampled = df.sample(frac=0.05, random_state=42)  # Set random_state for reproducibility

# Save the sampled data to a new CSV file
sampled_file_path = "temperature_daily_now.csv"
df_sampled.to_csv(sampled_file_path, index=False)

print(f"Sampled data saved to {sampled_file_path}")
