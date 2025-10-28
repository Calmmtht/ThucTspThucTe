import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5131';

export interface Content {
  id: number;
  title: string;
  content: string;
  page: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentCreateDTO {
  title: string;
  content: string;
  page: string;
  ImageFile?: File;
}

export interface ContentUpdateDTO {
  title?: string;
  content?: string;
  page?: string;
  ImageFile?: File;
}

class ContentService {
  private readonly baseUrl = `${API_URL}/api/contents`;
  private readonly axiosInstance = authService.axios;

  async getAllContents(): Promise<Content[]> {
    const response = await this.axiosInstance.get(this.baseUrl);
    return response.data;
  }

  async getContentById(id: string): Promise<Content> {
    const response = await this.axiosInstance.get(`${this.baseUrl}${id}`);
    return response.data;
  }

  async getContentsByPage(page: string): Promise<Content[]> {
    const response = await this.axiosInstance.get(`${this.baseUrl}/page/${page}`);
    return response.data;
  }

  async createContent(contentDto: ContentCreateDTO): Promise<Content> {
    const formData = new FormData();
    formData.append('title', contentDto.title);
    formData.append('content', contentDto.content);
    formData.append('page', contentDto.page);
    if (contentDto.ImageFile) {
      formData.append('ImageFile', contentDto.ImageFile);
    }

    const response = await this.axiosInstance.post(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateContent(id: string, contentDto: ContentUpdateDTO): Promise<Content> {
    const formData = new FormData();
    if (contentDto.title) formData.append('title', contentDto.title);
    if (contentDto.content) formData.append('content', contentDto.content);
    if (contentDto.page) formData.append('page', contentDto.page);
    if (contentDto.ImageFile) {
      formData.append('ImageFile', contentDto.ImageFile);
    }

    const response = await this.axiosInstance.put(`${this.baseUrl}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteContent(id: string): Promise<void> {
    await this.axiosInstance.delete(`${this.baseUrl}/${id}`);
  }
}

export const contentService = new ContentService(); 