import React, { useState } from 'react';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [gender, setGender] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage || !gender) {
      setStatusMessage('Please select an image and a gender!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('gender', gender);

    try {
      const response = await fetch('https://randomimg.almahmud.top/uploadmyownimages', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result, response)
      if (response.ok) {
        setStatusMessage('Image uploaded successfully!');
      } else {
        setStatusMessage(`Error: ${result.error || 'Image upload failed!'}`);
      }
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Select Image:
          <input type="file" onChange={handleImageChange} style={styles.input} required />
        </label>
        <label>
          Select Gender:
          <select value={gender} onChange={handleGenderChange} style={styles.select} required>
            <option value="">--Select Gender--</option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
          </select>
        </label>
        <button type="submit" style={styles.button}>Upload</button>
      </form>
      <p>{statusMessage}</p>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    marginBottom: '15px',
    padding: '8px',
  },
  select: {
    marginBottom: '15px',
    padding: '8px',
    width: '100%',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default App;
