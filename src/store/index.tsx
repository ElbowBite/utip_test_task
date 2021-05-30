import axios from 'axios';

export interface Comment {
  id: number;
  text: string;
  email: string;
  country: string;
}

export interface Document {
  id: number;
  fileName: string;
}

export const createStore = () => {
  return {
    comments: [] as Comment[],
    documents: [] as Document[],

    async addComment(text: string, email: string, country: string) {
      return axios
        .post('https://60b1d8f562ab150017ae151b.mockapi.io/comments', {
          id: this.comments.length > 0 ? this.comments[this.comments.length - 1].id + 1 : 0,
          text,
          email,
          country,
        })
        .then(() => this.fetchComments());
    },

    async addDocument(fileName: string) {
      return axios
        .post('https://60b1d8f562ab150017ae151b.mockapi.io/documents', {
          id: this.documents.length > 0 ? this.documents[this.documents.length - 1].id + 1 : 0,
          fileName,
        })
        .then(() => this.fetchDocuments());
    },

    async removeComment(id: number) {
      return axios.delete(`https://60b1d8f562ab150017ae151b.mockapi.io/comments/${id}`).then(() => this.fetchComments());
    },

    async removeDocument(id: number) {
      return axios.delete(`https://60b1d8f562ab150017ae151b.mockapi.io/documents/${id}`).then(() => this.fetchDocuments());
    },

    async clearDocuments() {
      return Promise.all(this.documents.map((d) => this.removeDocument(d.id)));
    },

    async fetchComments() {
      axios.get<Comment[]>('https://60b1d8f562ab150017ae151b.mockapi.io/comments').then((res) => {
        this.comments = res.data;
      });
    },

    async fetchDocuments() {
      axios.get<Document[]>('https://60b1d8f562ab150017ae151b.mockapi.io/documents').then((res) => {
        this.documents = res.data;
      });
    },
  };
};

export type TStore = ReturnType<typeof createStore>;
