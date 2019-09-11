import React, { useState, useEffect } from 'react';
import db from './firebase';
import styled from 'styled-components/macro';
import { GlobalStyle, theme, mixins } from './styles';
const { colors } = theme;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  text-align: center;

  header {
    padding: 50px;

    h1 {
      font-size: 50px;
      margin: 0;
    }
    h2 {
      font-size: 30px;
      margin: 0;
      color: ${colors.slate};
    }
    input {
      ${mixins.boxShadow};
      width: 600px;
      padding: 20px;
      font-size: 30px;
      background: ${colors.lightNavy};
      color: ${colors.white};
      border: 0;
      outline: 0;
      margin-top: 50px;

      ::placeholder {
        color: ${colors.grey};
      }
    }
    button {
      border: 0;
      padding: 15px 20px;
      font-size: 20px;
      background: ${colors.blueGrey};
      color: ${colors.slate};
      width: 600px;
      &:hover,
      &:focus {
        filter: brightness(1.25);
      }
    }
  }

  main {
    width: 600px;
    margin: 0 auto;
    text-align: left;
    ol {
      list-style-type: none;
    }
    li {
      margin-bottom: 2rem;
      a {
        ${mixins.boxShadow};
        background-color: ${colors.blueGrey};
        display: block;
        padding: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover,
        &:focus {
          filter: brightness(1.25);
        }
        .index {
          margin-right: 2rem;
          color: ${colors.slate};
          font-weight: 700;
        }
      }
    }
  }

  footer {
    font-size: 14px;
    font-weight: 700;
    color: ${colors.grey};
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 20px;

    p {
      margin: 0 0 10px 0;
    }

    a {
      text-decoration: underline;
      &:hover,
      &:focus {
        color: ${colors.white};
      }
    }
  }
`;

const App = () => {
  const [buttonShown, setButtonShown] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');
  const [data, setData] = useState([]);
  const linksCollection = db.collection('links');

  const createDocs = snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  useEffect(() => {
    const linksCollection = db.collection('links');
    let ignore = false;

    const fetchData = async () => {
      const querySnapshot = await linksCollection.get();
      const docs = createDocs(querySnapshot);

      if (!ignore) {
        setData(docs);
      }
    };

    fetchData();

    linksCollection.onSnapshot(querySnapshot => {
      const docs = createDocs(querySnapshot);
      setData(docs);
    });

    return () => (ignore = true);
  }, []);

  const onInputChange = e => {
    const { value } = e.target;
    setButtonShown(!!value);
    setSubmissionLink(value);
  };

  const onSubmit = e => {
    e.preventDefault();

    if (!window.confirm(`Are you sure you want to submit the link: ${submissionLink}?`)) {
      return;
    }
    setButtonShown(false);
    setSubmissionLink('');

    linksCollection
      .add({ url: submissionLink })
      .catch(error => console.error(`Error adding document: ${error}`));
  };

  return (
    <AppContainer>
      <GlobalStyle />
      <section>
        <header>
          <h1>Intro to Web Dev Workshop</h1>
          <h2>
            Submit your pens here{' '}
            <span role="img" aria-label="writing">
              ✍️
            </span>
          </h2>
          <form onSubmit={e => onSubmit(e)}>
            <div>
              <input
                type="url"
                placeholder="https://codepen.io/asdf/pen/xyz"
                value={submissionLink}
                onChange={e => onInputChange(e)}
              />
            </div>
            <div>{buttonShown && <button type="submit">Submit</button>}</div>
          </form>
        </header>

        <main>
          <ol>
            {data.length &&
              data.map((s, i) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    <span className="index">
                      #{i}&nbsp;&nbsp;&nbsp;
                      <span role="img" aria-label="point right">
                        👉
                      </span>
                    </span>
                    <span>{s.url}</span>
                  </a>
                </li>
              ))}
          </ol>
        </main>
      </section>

      <footer>
        <p>
          <span role="img" aria-label="mountain">
            🏔
          </span>
          &nbsp;WISE Summit 2019&nbsp;&nbsp;
          <span role="img" aria-label="mountain">
            🏔
          </span>
        </p>
        <p>
          <a
            href="https://github.com/bchiang7/workshop-submissions"
            target="_blank"
            rel="noopener noreferrer">
            View Source
          </a>
        </p>
      </footer>
    </AppContainer>
  );
};

export default App;
